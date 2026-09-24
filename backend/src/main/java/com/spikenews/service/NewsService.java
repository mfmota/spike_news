package com.spikenews.service;

import com.spikenews.dto.NewsRequestDTO;
import com.spikenews.dto.NewsResponseDTO;
import com.spikenews.model.News;
import com.spikenews.model.Role;
import com.spikenews.model.Team;
import com.spikenews.model.User;
import com.spikenews.repository.NewsRepository;
import com.spikenews.repository.TeamRepository;
import com.spikenews.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsService {

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final NotificationService notificationService;

    public NewsService(
            NewsRepository newsRepository,
            UserRepository userRepository,
            TeamRepository teamRepository,
            NotificationService notificationService) {
        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.notificationService = notificationService;
    }

    public Page<NewsResponseDTO> getAllNews(Pageable pageable) {
        return newsRepository.findAllByOrderByDataPublicacaoDesc(pageable)
                .map(NewsResponseDTO::new);
    }

    public List<NewsResponseDTO> getNewsByTeam(Long teamId) {
        return newsRepository.findByTimeRelacionadoId(teamId)
                .stream()
                .map(NewsResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<NewsResponseDTO> getNewsByAuthor(String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));

        return newsRepository.findByAutorIdOrderByDataPublicacaoDesc(author.getId())
                .stream()
                .map(NewsResponseDTO::new)
                .collect(Collectors.toList());
    }

    public NewsResponseDTO getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notícia não encontrada com ID: " + id));
        return new NewsResponseDTO(news);
    }

    @Transactional
    public NewsResponseDTO createNews(String email, NewsRequestDTO requestDTO) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));

        Team team = null;
        if (requestDTO.getTeamId() != null) {
            team = teamRepository.findById(requestDTO.getTeamId()).orElse(null);
        }

        News news = new News(requestDTO.getTitulo(), requestDTO.getConteudo(), author, team);
        News saved = newsRepository.save(news);

        notificationService.notifyUsersForNews(saved);

        return new NewsResponseDTO(saved);
    }

    @Transactional
    public NewsResponseDTO updateNews(Long id, String email, NewsRequestDTO requestDTO) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notícia não encontrada"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!news.getAutor().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Você só pode editar notícias de sua própria autoria");
        }

        news.setTitulo(requestDTO.getTitulo());
        news.setConteudo(requestDTO.getConteudo());

        if (requestDTO.getTeamId() != null) {
            Team team = teamRepository.findById(requestDTO.getTeamId()).orElse(null);
            news.setTimeRelacionado(team);
        } else {
            news.setTimeRelacionado(null);
        }

        News updated = newsRepository.save(news);
        return new NewsResponseDTO(updated);
    }

    @Transactional
    public void deleteNews(Long id, String email) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notícia não encontrada"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!news.getAutor().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Você só pode excluir notícias de sua própria autoria");
        }

        newsRepository.delete(news);
    }
}

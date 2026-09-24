package com.spikenews.service;

import com.opencsv.CSVWriter;
import com.spikenews.model.Match;
import com.spikenews.model.News;
import com.spikenews.model.User;
import com.spikenews.repository.MatchRepository;
import com.spikenews.repository.NewsRepository;
import com.spikenews.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CsvReportService {

    private final MatchRepository matchRepository;
    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public CsvReportService(
            MatchRepository matchRepository,
            NewsRepository newsRepository,
            UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
    }

    public byte[] generatePublicStatsCsv() {
        List<Match> matches = matchRepository.findAll();
        StringWriter stringWriter = new StringWriter();

        try (CSVWriter csvWriter = new CSVWriter(stringWriter)) {
            // Cabeçalho
            csvWriter.writeNext(new String[]{
                    "ID_Partida",
                    "Time_Casa",
                    "Pontuacao_Casa",
                    "Pontuacao_Fora",
                    "Time_Fora",
                    "Status",
                    "Evento",
                    "Data_Partida",
                    "Ultima_Atualizacao"
            });

            // Linhas
            for (Match m : matches) {
                csvWriter.writeNext(new String[]{
                        String.valueOf(m.getId()),
                        m.getTimeCasa() != null ? m.getTimeCasa().getNome() : "N/A",
                        String.valueOf(m.getPontuacaoCasa()),
                        String.valueOf(m.getPontuacaoFora()),
                        m.getTimeFora() != null ? m.getTimeFora().getNome() : "N/A",
                        m.getStatus() != null ? m.getStatus().name() : "N/A",
                        m.getEvento() != null ? m.getEvento() : "N/A",
                        m.getDataPartida() != null ? m.getDataPartida().format(formatter) : "N/A",
                        m.getUpdatedAt() != null ? m.getUpdatedAt().format(formatter) : "N/A"
                });
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar CSV de estatísticas públicas: " + e.getMessage());
        }

        return stringWriter.toString().getBytes();
    }

    public byte[] generateJournalistNewsCsv(String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Jornalista não encontrado"));

        List<News> newsList = newsRepository.findByAutorIdOrderByDataPublicacaoDesc(author.getId());
        StringWriter stringWriter = new StringWriter();

        try (CSVWriter csvWriter = new CSVWriter(stringWriter)) {
            // Cabeçalho
            csvWriter.writeNext(new String[]{
                    "ID_Noticia",
                    "Titulo",
                    "Time_Relacionado",
                    "Data_Publicacao",
                    "Tamanho_Caracteres",
                    "Autor_Nome",
                    "Autor_Email"
            });

            // Linhas
            for (News n : newsList) {
                csvWriter.writeNext(new String[]{
                        String.valueOf(n.getId()),
                        n.getTitulo(),
                        n.getTimeRelacionado() != null ? n.getTimeRelacionado().getNome() : "Geral",
                        n.getDataPublicacao() != null ? n.getDataPublicacao().format(formatter) : "N/A",
                        String.valueOf(n.getConteudo() != null ? n.getConteudo().length() : 0),
                        author.getNome(),
                        author.getEmail()
                });
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar CSV de notícias do jornalista: " + e.getMessage());
        }

        return stringWriter.toString().getBytes();
    }
}

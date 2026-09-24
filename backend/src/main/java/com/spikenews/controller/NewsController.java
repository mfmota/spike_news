package com.spikenews.controller;

import com.spikenews.dto.NewsRequestDTO;
import com.spikenews.dto.NewsResponseDTO;
import com.spikenews.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<?> getAllNews(
            @RequestParam(required = false) Long teamId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (teamId != null) {
            return ResponseEntity.ok(newsService.getNewsByTeam(teamId));
        }
        Page<NewsResponseDTO> newsPage = newsService.getAllNews(PageRequest.of(page, size));
        return ResponseEntity.ok(newsPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponseDTO> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('JORNALISTA', 'ADMIN')")
    public ResponseEntity<List<NewsResponseDTO>> getMyNews(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(newsService.getNewsByAuthor(userDetails.getUsername()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('JORNALISTA', 'ADMIN')")
    public ResponseEntity<NewsResponseDTO> createNews(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody NewsRequestDTO requestDTO) {
        NewsResponseDTO created = newsService.createNews(userDetails.getUsername(), requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('JORNALISTA', 'ADMIN')")
    public ResponseEntity<NewsResponseDTO> updateNews(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody NewsRequestDTO requestDTO) {
        NewsResponseDTO updated = newsService.updateNews(id, userDetails.getUsername(), requestDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('JORNALISTA', 'ADMIN')")
    public ResponseEntity<Void> deleteNews(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        newsService.deleteNews(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}

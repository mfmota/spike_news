package com.spikenews.controller;

import com.spikenews.service.CsvReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final CsvReportService csvReportService;

    public ReportController(CsvReportService csvReportService) {
        this.csvReportService = csvReportService;
    }

    @GetMapping("/public/stats/csv")
    public ResponseEntity<byte[]> downloadPublicStatsCsv() {
        byte[] csvBytes = csvReportService.generatePublicStatsCsv();
        String filename = "spike_news_estatisticas_" + LocalDate.now() + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvBytes);
    }

    @GetMapping("/journalist/news/csv")
    @PreAuthorize("hasAnyRole('JORNALISTA', 'ADMIN')")
    public ResponseEntity<byte[]> downloadJournalistNewsCsv(@AuthenticationPrincipal UserDetails userDetails) {
        byte[] csvBytes = csvReportService.generateJournalistNewsCsv(userDetails.getUsername());
        String filename = "spike_news_materias_jornalista_" + LocalDate.now() + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvBytes);
    }
}

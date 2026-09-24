package com.spikenews.repository;

import com.spikenews.model.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    Page<News> findAllByOrderByDataPublicacaoDesc(Pageable pageable);
    List<News> findByTimeRelacionadoId(Long teamId);
    List<News> findByAutorId(Long autorId);
    List<News> findByAutorIdOrderByDataPublicacaoDesc(Long autorId);
}

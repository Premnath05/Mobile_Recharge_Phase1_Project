package com.spectrum1web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spectrum1web.model.SupportQuery;

import java.util.List;

public interface SupportQueryRepository extends JpaRepository<SupportQuery, Integer> {
    List<SupportQuery> findAllByOrderByQueryDateDesc();
}
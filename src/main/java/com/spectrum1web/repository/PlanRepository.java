package com.spectrum1web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spectrum1web.model.Plan;

import java.util.List;

public interface PlanRepository extends JpaRepository<Plan, Integer> {
    // Fetch plans by category ID
    List<Plan> findByCategory_CategoryId(Integer categoryId);
}
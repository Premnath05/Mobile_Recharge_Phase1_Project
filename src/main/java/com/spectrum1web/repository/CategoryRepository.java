package com.spectrum1web.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spectrum1web.model.Category;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // No additional methods needed for basic CRUD operations
}
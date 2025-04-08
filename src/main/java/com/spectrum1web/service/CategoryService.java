package com.spectrum1web.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spectrum1web.model.Category;
import com.spectrum1web.repository.CategoryRepository;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Add a new category
    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Delete a category by ID
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get a category by ID
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category with ID " + id + " not found!"));
    }
}
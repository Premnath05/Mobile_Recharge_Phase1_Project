package com.spectrum1web.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spectrum1web.exception.ResourceNotFoundException;
import com.spectrum1web.model.Plan;
import com.spectrum1web.repository.PlanRepository;

import java.util.List;

@Service
public class PlanService {
    @Autowired
    private PlanRepository planRepository;
     
    
 // Add a new plan
    public Plan addPlan(Plan plan) {
        return planRepository.save(plan);
    }

    // Update an existing plan
    public Plan updatePlan(Plan plan) {
        return planRepository.save(plan);
    }

    // Delete a plan
    public void deletePlan(Integer id) {
        planRepository.deleteById(id);
    }

    // Get all plans
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    // Get a plan by ID
    public Plan getPlanById(Integer planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with ID: " + planId));
    }

    // Get plans by category ID
    public List<Plan> getPlansByCategory(Integer categoryId) {
        return planRepository.findByCategory_CategoryId(categoryId);
    }
    

 // Fetch the total number of plans
    public long getTotalPlans() {
        return planRepository.count();
    }
   
}
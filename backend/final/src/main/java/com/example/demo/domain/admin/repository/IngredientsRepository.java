package com.example.demo.domain.admin.repository;

import com.example.demo.entity.Ingredients;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientsRepository extends JpaRepository<Ingredients, String> {
}


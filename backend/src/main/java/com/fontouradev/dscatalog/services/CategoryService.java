package com.fontouradev.dscatalog.services;

import java.util.List;

import com.fontouradev.dscatalog.entities.Category;
import com.fontouradev.dscatalog.repositories.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository repository;

    @Transactional(readOnly = true)
    public List<Category> findAll(){
        return repository.findAll();
    }
}

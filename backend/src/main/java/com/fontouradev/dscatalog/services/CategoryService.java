package com.fontouradev.dscatalog.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fontouradev.dscatalog.dto.CategoryDTO;
import com.fontouradev.dscatalog.entities.Category;
import com.fontouradev.dscatalog.repositories.CategoryRepository;



@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository repository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> findAll(){
        List<Category> list = repository.findAll();
        
        return list.stream().map(x -> new CategoryDTO(x)).collect(Collectors.toList());
        
//        List<CategoryDTO> listDto = new ArrayList<>();
//        for (Category category : list) {
//			listDto.add(new CategoryDTO(category));
//		}
        
//        return listDto;
    }
}

package com.fontouradev.dscatalog.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fontouradev.dscatalog.dto.CategoryDTO;
import com.fontouradev.dscatalog.entities.Category;
import com.fontouradev.dscatalog.repositories.CategoryRepository;
import com.fontouradev.dscatalog.services.exceptions.DatabaseException;
import com.fontouradev.dscatalog.services.exceptions.ResourceNotFoundException;


@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository repository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> findAll(){
        List<Category> list = repository.findAll();
        
//        List<CategoryDTO> listDto = new ArrayList<>();
//        for (Category category : list) {
//			listDto.add(new CategoryDTO(category));
//		}
        
//        return listDto;
        return list.stream().map(x -> new CategoryDTO(x)).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
	public Page<CategoryDTO> findAllPaged(PageRequest pageRequest) {
    	Page<Category> page = repository.findAll(pageRequest);
		return page.map(x -> new CategoryDTO(x));
	}

    @Transactional(readOnly = true)
	public CategoryDTO findById(Long id) {
		
		Optional<Category> obj = repository.findById(id);
		Category entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found") );
		CategoryDTO dto = new CategoryDTO(entity);
		
		return dto;
	}

	@Transactional
	public CategoryDTO insert(CategoryDTO dto) {
		Category entity = new Category();
		entity.setName(dto.getName());
		
		entity = repository.save(entity);
		
		return new CategoryDTO(entity);
	}

	@Transactional
	public CategoryDTO update(Long id, CategoryDTO dto) {
		try {			
			Category entity = repository.getOne(id);
			entity.setName(dto.getName());
			entity = repository.save(entity);
			
			return new CategoryDTO(entity);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Id not found " + id);
		}

	}

	public Object delete(Long id) {
		try {
			repository.deleteById(id);
			
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("Id not found " + id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException("Integrity violation");
		}
		
		return null;
	}

}

package com.fontouradev.dscatalog.services;

import com.fontouradev.dscatalog.dto.CategoryDTO;
import com.fontouradev.dscatalog.dto.ProductDTO;
import com.fontouradev.dscatalog.dto.UriDTO;
import com.fontouradev.dscatalog.entities.Category;
import com.fontouradev.dscatalog.entities.Product;
import com.fontouradev.dscatalog.repositories.CategoryRepository;
import com.fontouradev.dscatalog.repositories.ProductRepository;
import com.fontouradev.dscatalog.services.exceptions.DatabaseException;
import com.fontouradev.dscatalog.services.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
	
	@Autowired
	private ProductRepository repository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	@Autowired
	private S3Service s3Service;
	
	@Transactional(readOnly = true)
	public Page<ProductDTO> findAllPaged(Long categoryId, String name, PageRequest pageRequest) {
		List<Category> categories = (categoryId == 0) ? null : Arrays.asList(categoryRepository.getOne(categoryId));
		Page<Product> page = repository.findAllWithCategoryAndName(categories, name, pageRequest);
		repository.findProductWithCategories(page.getContent());
		return page.map(x -> new ProductDTO(x, x.getCategories()));
	}
	
	@Transactional(readOnly = true)
	public ProductDTO findById(Long id) {
		Optional<Product> obj = repository.findById(id);
		Product entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found."));
		return new ProductDTO(entity, entity.getCategories());
	}
	
	@Transactional
	public ProductDTO insert(ProductDTO dto) {
		Product entity = new Product();
		copyDtoToEntity(dto, entity);
		entity = repository.save(entity);
		return new ProductDTO(entity);
	}
	
	@Transactional
	public ProductDTO update(Long id, ProductDTO dto) {
		try {
			Product entity = repository.getOne(id);
			copyDtoToEntity(dto, entity);
			entity = repository.save(entity);
			return new ProductDTO(entity);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Id not found " + id);
		}
	}

	public void delete(Long id) {
		try {
			repository.deleteById(id);
			
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("Id not found " + id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException("Integrity violation");
		}
	}
	
	private void copyDtoToEntity(ProductDTO dto, Product entity) {
		
		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity.setDate(dto.getDate());
		entity.setImgUrl(dto.getImgUrl());
		entity.setPrice(dto.getPrice());
		
		entity.getCategories().clear();
		for (CategoryDTO categoryDto : dto.getCategories()) {
			Category category = categoryRepository.getOne(categoryDto.getId());
			entity.getCategories().add(category);
		}

		if (entity.getCategories().size() == 0) {
			Category category = categoryRepository.getOne(1L);
			entity.getCategories().add(category);
		}
	}

	public UriDTO uploadFile(MultipartFile file) {
		URL url = s3Service.uploadFile(file);
		return new UriDTO(url.toString());
	}
}

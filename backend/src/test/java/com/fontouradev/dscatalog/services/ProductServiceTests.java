package com.fontouradev.dscatalog.services;

import com.fontouradev.dscatalog.dto.ProductDTO;
import com.fontouradev.dscatalog.entities.Category;
import com.fontouradev.dscatalog.entities.Product;
import com.fontouradev.dscatalog.repositories.CategoryRepository;
import com.fontouradev.dscatalog.repositories.ProductRepository;
import com.fontouradev.dscatalog.factory.CategoryFactory;
import com.fontouradev.dscatalog.factory.ProductFactory;
import com.fontouradev.dscatalog.services.exceptions.DatabaseException;
import com.fontouradev.dscatalog.services.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class ProductServiceTests {

    @InjectMocks
    private ProductService service;
    @Mock
    private ProductRepository repository;
    @Mock
    private CategoryRepository categoryRepository;

    private Long existingId;
    private Long noExistingId;
    private Long dependentId;
    private Product product;
    private ProductDTO productDTO;
    private Category category;
    private PageImpl<Product> page;
    private PageRequest pageRequest;

    @BeforeEach
    void setUp() {
        existingId = 1L;
        noExistingId = 1000L;
        dependentId = 10L;
        product = ProductFactory.createProduct();
        productDTO = ProductFactory.createProductDTO();
        category = CategoryFactory.createCategory();
        page = new PageImpl<>(List.of(product));
        pageRequest = PageRequest.of(0,10);

        when(repository.save(any())).thenReturn(product);
        when(repository.getOne(existingId)).thenReturn(product);
        when(repository.findAllWithCategoryAndName(anyList(), anyString(), any())).thenReturn(page);
        when(repository.findById(existingId)).thenReturn(Optional.of(product));
        when(repository.findById(noExistingId)).thenReturn(Optional.empty());
        when(categoryRepository.getOne(existingId)).thenReturn(category);
        doNothing().when(repository).deleteById(existingId);
        doThrow(ResourceNotFoundException.class).when(repository).deleteById(noExistingId);
        doThrow(DatabaseException.class).when(repository).deleteById(dependentId);
        doThrow(ResourceNotFoundException.class).when(repository).getOne(noExistingId);
    }

    @Test
    void delete_shouldDoNothing_whenIdExists() {

        assertDoesNotThrow(() -> {
            service.delete(existingId);
        });
        verify(repository, times(1)).deleteById(existingId);
    }

    @Test
    void delete_shouldThrowEmptyResultDataAccessException_whenIdDoesNotExists() {
        assertThrows(ResourceNotFoundException.class, () -> {
            service.delete(noExistingId);
        });
        verify(repository, times(1)).deleteById(noExistingId);
    }

    @Test
    void delete_shouldThrowDatabaseException_whenIdIsDependent() {
        assertThrows(DatabaseException.class, () -> {
            service.delete(dependentId);
        });
        verify(repository, times(1)).deleteById(dependentId);
    }

    @Test
    void findAllPaged_shouldReturnAPage() {
        Page<ProductDTO> result = service.findAllPaged(1L, "test", pageRequest);

        verify(repository, times(1)).findAllWithCategoryAndName(anyList(),anyString(),any());
        assertEquals(page.getSize(), result.getSize());
    }

    @Test
    void findById_shouldReturnProductDto_whenIdExists() {

        ProductDTO result = service.findById(existingId);

        verify(repository, times(1)).findById(existingId);
        assertEquals(productDTO.getName(), result.getName());
    }

    @Test
    void findById_shouldThrowResourceNotFoundException_whenIdNotExists() {
        assertThrows(ResourceNotFoundException.class, () -> service.findById(noExistingId));
    }

    @Test
    void update_shouldReturnProductDTO_whenIdExists() {
        ProductDTO result = service.update(existingId, productDTO);

        assertEquals(productDTO.getName(), result.getName());
        verify(repository, times(1)).save(product);
    }

    @Test
    void update_shouldThrowResourceNotFoundException_whenIdNotExists() {
        assertThrows(ResourceNotFoundException.class, () -> service.update(noExistingId, productDTO));
    }

}

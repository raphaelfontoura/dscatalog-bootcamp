package com.fontouradev.dscatalog.repositories;

import com.fontouradev.dscatalog.entities.Category;
import com.fontouradev.dscatalog.entities.Product;
import com.fontouradev.dscatalog.repositories.fabric.ProductFabric;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@DataJpaTest
public class ProductRepositoryTests {

    @Autowired
    private ProductRepository repository;
    @Autowired
    private CategoryRepository categoryRepository;
    private Long existingId;
    private Long noExistingId;
    private Long countTotalProducts;
    private Long countPcGamer;
    private PageRequest pageRequest;

    @BeforeEach
    void setUp() {
        existingId = 1L;
        noExistingId = 1000L;
        countTotalProducts = 25L;
        countPcGamer = 21L;
        pageRequest = PageRequest.of(0, 10);
    }

    @Test
    void findAllWithCategoryAndName_ShouldReturnEmptyPageProducts_WhenCategoryNoExists() {
        List<Category> categories = Collections.singletonList(new Category(1000L, "No Category"));

        Page<Product> result = repository.findAllWithCategoryAndName(categories, "", pageRequest);

        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    void findAllWithCategoryAndName_ShouldReturnProductsByCategory_WhenCategoryIsPresent() {
        List<Category> categories = Collections.singletonList(categoryRepository.getOne(3L));

        Page<Product> result = repository.findAllWithCategoryAndName(categories, "", pageRequest);

        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals(23L, result.getTotalElements());
    }

    @Test
    void findAllWithCategoryAndName_ShouldReturnAllProducts_WhenNameIsEmpty() {
        String name = "";

        Page<Product> result = repository.findAllWithCategoryAndName(null, name, pageRequest);

        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals(countTotalProducts, result.getTotalElements());
    }

    @Test
    void findAllWithCategoryAndName_ShouldReturnProducts_WhenNameExistsAndIgnoringCase() {
        String name = "pc gAMer";

        Page<Product> result = repository.findAllWithCategoryAndName(null, name, pageRequest);

        Assertions.assertEquals(countPcGamer, result.getTotalElements());
    }

    @Test
    void findAllWithCategoryAndName_ShouldReturnProducts_WhenNameExists() {
        String name = "PC Gamer";

        Page<Product> result = repository.findAllWithCategoryAndName(null, name, pageRequest);

        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals(countPcGamer, result.getTotalElements());
    }

    @Test
    void save_ShouldPersist_WhenIdIsNull() {
        Product product = ProductFabric.createProduct();
        product.setId(null);

        product = repository.save(product);
        Optional<Product> result = repository.findById(product.getId());

        Assertions.assertNotNull(product.getId());
        Assertions.assertEquals(countTotalProducts + 1L, product.getId());
        Assertions.assertTrue(result.isPresent());
        Assertions.assertSame(result.get(), product);
    }

    @Test
    void delete_ShouldDeleteObject_WhenIdExists() {
        repository.deleteById(existingId);

        Optional<Product> result = repository.findById(existingId);

        Assertions.assertFalse(result.isPresent());
    }

    @Test
    void delete_ShouldThrowsEmptyResultDataAccessException_WhenIdNotExists() {
        Assertions.assertThrows(EmptyResultDataAccessException.class, () -> repository.deleteById(noExistingId));
    }
}

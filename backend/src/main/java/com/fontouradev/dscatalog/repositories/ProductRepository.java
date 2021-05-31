package com.fontouradev.dscatalog.repositories;

import com.fontouradev.dscatalog.entities.Category;
import com.fontouradev.dscatalog.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p FROM Product p " +
            "INNER JOIN p.categories c " +
            "WHERE (COALESCE(:categories) IS NULL OR c IN :categories) " +
            "AND (LOWER(p.name) LIKE LOWER(CONCAT('%',:name,'%')))")
    Page<Product> findAllWithCategoryAndName(List<Category> categories, String name, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN FETCH p.categories WHERE p IN :products")
    List<Product> findProductWithCategories(List<Product> products);

}

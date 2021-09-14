package com.fontouradev.dscatalog.factory;

import com.fontouradev.dscatalog.dto.ProductDTO;
import com.fontouradev.dscatalog.entities.Product;

import java.time.Instant;

public class ProductFactory {
    public static Product createProduct() {
        return new Product(1L,
                "phone",
                "good phone",
                800.00,
                "http://img.com/img.png",
                Instant.parse("2021-10-20T03:00:00Z"));
    }

    public static ProductDTO createProductDTO() {
        return new ProductDTO(createProduct());
    }

    public static ProductDTO createProductDTO(Long id) {
        ProductDTO dto = createProductDTO();
        dto.setId(id);
        return dto;
    }
}

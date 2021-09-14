package com.fontouradev.dscatalog.factory;

import com.fontouradev.dscatalog.entities.Category;

public class CategoryFactory {
    public static Category createCategory() {
        return new Category(1L, "categoria");
    }

}

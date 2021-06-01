package com.fontouradev.dscatalog.dto;

import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

public class FileDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private MultipartFile file;

    public FileDTO(){}

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}

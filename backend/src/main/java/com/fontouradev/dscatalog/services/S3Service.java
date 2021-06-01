package com.fontouradev.dscatalog.services;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.apache.commons.io.FilenameUtils;
import org.joda.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

@Service
public class S3Service {

    private static Logger LOG = LoggerFactory.getLogger(S3Service.class);

    @Autowired
    private AmazonS3 s3client;

    @Value("${s3.bucket}")
    private String bucketName;

    public URL uploadFile(MultipartFile file) {
        try {
            String originalName = file.getOriginalFilename();
            String extension = FilenameUtils.getExtension(originalName);
            String fileName = Instant.now().toDate().getTime() + "." + extension;

            InputStream is = file.getInputStream();
            String contentType = file.getContentType();
            return uploadFileAws(is, fileName, contentType);

        } catch (IOException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    private URL uploadFileAws(InputStream is, String fileName, String contentType) {
        ObjectMetadata meta = new ObjectMetadata();
        meta.setContentType(contentType);
        LOG.info("upload start.");
        s3client.putObject(bucketName, fileName, is, meta);
        LOG.info("upload finish.");
        return s3client.getUrl(bucketName, fileName);
    }
}

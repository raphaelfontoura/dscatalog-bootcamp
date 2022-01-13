package com.fontouradev.dscatalog.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fontouradev.dscatalog.dto.ProductDTO;
import com.fontouradev.dscatalog.factory.ProductFactory;
import com.fontouradev.dscatalog.services.ProductService;
import com.fontouradev.dscatalog.services.exceptions.DatabaseException;
import com.fontouradev.dscatalog.services.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.security.InvalidParameterException;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductResourceTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${security.oauth2.client.client-id}")
    private String clientId;

    @Value("${security.oauth2.client.client-secret}")
    private String clientSecret;

    private Long existingId;
    private Long nonExistingId;
    private Long dependentId;
    private ProductDTO newProductDTO;
    private ProductDTO existingProductDTO;
    private ProductDTO invalidProductPrice;
    private PageImpl<ProductDTO> page;

    private String operatorUsername, operatorPassword;

    @BeforeEach
    void setUp() throws Exception {
        this.operatorUsername = "alex@gmail.com";
        this.operatorPassword = "123456";

        this.existingId = 1L;
        this.nonExistingId = 2L;
        this.dependentId = 3L;
        this.newProductDTO = ProductFactory.createProductDTO();
        this.existingProductDTO = ProductFactory.createProductDTO(existingId);
        this.invalidProductPrice = ProductFactory.createProductDTO();
        invalidProductPrice.setPrice(-1d);
        this.page = new PageImpl<>(List.of(existingProductDTO));

        when(service.findById(existingId)).thenReturn(existingProductDTO);
        when(service.findById(nonExistingId)).thenThrow(ResourceNotFoundException.class);
        when(service.findAllPaged(any(), anyString(), any())).thenReturn(page);
        when(service.insert(any())).thenReturn(existingProductDTO);
        when(service.update(eq(existingId), any())).thenReturn(existingProductDTO);
        when(service.update(eq(nonExistingId), any())).thenThrow(ResourceNotFoundException.class);
        when(service.insert(existingProductDTO)).thenReturn(existingProductDTO);
        when(service.insert(invalidProductPrice)).thenThrow(InvalidParameterException.class);

        doNothing().when(service).delete(existingId);
        doThrow(ResourceNotFoundException.class).when(service).delete(nonExistingId);
        doThrow(DatabaseException.class).when(service).delete(dependentId);
    }

    @Test
    public void insert_shouldReturnUnprocessableEntity_whenInvalidProduct() throws Exception {
        String jsonProduct = objectMapper.writeValueAsString(invalidProductPrice);
        String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonProduct)
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    public void insert_shouldReturnProductDTO_whenValidProduct() throws Exception {
        String jsonProduct = objectMapper.writeValueAsString(newProductDTO);
        String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonProduct)
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.id").value(existingId));
    }

    @Test
    public void findById_shouldReturnProduct_whenIdExists() throws Exception {
        mockMvc.perform(get("/products/{id}",existingId)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.id").value(existingId));
    }

    @Test
    public void findById_shouldReturnResourceNotFound_whenIdNonExists() throws Exception {
        ResultActions result = mockMvc.perform(get("/products/{id}",nonExistingId));
        result.andExpect(status().isNotFound());
    }

    @Test
    public void findAll_shouldReturnPage() throws Exception {
        mockMvc.perform(get("/products")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").exists())
                .andExpect(jsonPath("$.content.[0].name").exists())
                .andExpect(jsonPath("$.content.[0].name").value("phone"));
    }

    @Test
    public void update_shouldReturnProductDTO_whenIdExists() throws Exception {
        String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
        String jsonBody = objectMapper.writeValueAsString(newProductDTO);

        mockMvc.perform(put("/products/{id}", existingId)
                .header("Authorization", "Bearer " + accessToken)
                .content(jsonBody)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.id").value(existingId))
                .andExpect(jsonPath("$.name").value(newProductDTO.getName()))
                .andExpect(jsonPath("$.price").value(newProductDTO.getPrice()));
    }

    @Test
    public void update_shouldReturnNotFoundException_whenIdNonExists() throws Exception {
        String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
        String jsonBody = objectMapper.writeValueAsString(newProductDTO);
        mockMvc.perform(put("/products/{id}", nonExistingId)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonBody)
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNotFound());
    }

    @Test
    public void delete_shouldReturnNoContent_whenIdExists() throws Exception {
        String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
        mockMvc.perform(delete("/products/{id}", existingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNoContent());
    }

    @Test
    public void delete_shouldReturnNotFoundException_whenIdNonExists() throws Exception {
        String accessToken = obtainAccessToken(operatorUsername, operatorPassword);
        mockMvc.perform(delete("/products/{id}", nonExistingId)
                .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNotFound());
    }

    private String obtainAccessToken(String username, String password) throws Exception {

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "password");
        params.add("client_id", clientId);
        params.add("username", username);
        params.add("password", password);

        ResultActions result
                = mockMvc.perform(post("/oauth/token")
                        .params(params)
                        .with(httpBasic(clientId, clientSecret))
                        .accept("application/json;charset=UTF-8"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"));

        String resultString = result.andReturn().getResponse().getContentAsString();

        JacksonJsonParser jsonParser = new JacksonJsonParser();
        return jsonParser.parseMap(resultString).get("access_token").toString();
    }
}

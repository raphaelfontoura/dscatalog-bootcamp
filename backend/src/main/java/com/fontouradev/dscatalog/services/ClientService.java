package com.fontouradev.dscatalog.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fontouradev.dscatalog.dto.ClientDTO;
import com.fontouradev.dscatalog.entities.Client;
import com.fontouradev.dscatalog.repositories.ClientRepository;
import com.fontouradev.dscatalog.services.exceptions.DatabaseException;
import com.fontouradev.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class ClientService {
	
	@Autowired
	private ClientRepository repository;
	
	@Transactional(readOnly = true)
	public Page<ClientDTO> findAllPaged(PageRequest pageRequest){
		Page<Client> list = repository.findAll(pageRequest);
		return list.map(client -> new ClientDTO(client));
	}

	@Transactional(readOnly = true)
	public ClientDTO findById(Long id) {
		Optional<Client> obj = repository.findById(id);
		Client client = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));

		return new ClientDTO(client);
	}

	@Transactional
	public ClientDTO insert(ClientDTO clientDto) {
		
		if (!validateCPF(clientDto.getCpf())) {
			throw new IllegalArgumentException("CPF invalid.");
		}
		
		Client client = new Client();
		ClientDtoToEntity(clientDto, client);
		client = repository.save(client);
		return new ClientDTO(client);
	}

	@Transactional
	public ClientDTO update(Long id, ClientDTO clientDto) {
		
		if (!validateCPF(clientDto.getCpf())) {
			throw new IllegalArgumentException("CPF invalid.");
		}
		
		try {
			Client client = repository.getOne(id);
			ClientDtoToEntity(clientDto, client);
			client = repository.save(client);
			return new ClientDTO(client);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("ID not found " + id);
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
	
	private void ClientDtoToEntity(ClientDTO clientDto, Client client) {
		client.setName(clientDto.getName());
		client.setCpf(clientDto.getCpf());
		client.setIncome(clientDto.getIncome());
		client.setBirthDate(clientDto.getBirthDate());
		client.setChildren(clientDto.getChildren());
	}
	
	private Boolean validateCPF(String cpf) {
		char[] list = cpf.toCharArray();
		List<Integer> numbers = new ArrayList<>();
		for (char character : list) {
			numbers.add(Character.getNumericValue(character));
		}
		if (numbers.size() != 11) {
			return false;
		}
		if (numbers.get(9) != calculateVerifyDigit(9, 10, numbers)) {
			return false;
		}
		if (numbers.get(10) != calculateVerifyDigit(10, 11, numbers)) {
			return false;
		}
		
		return true;
	}
	
	private Integer calculateVerifyDigit(int limit, int constant, List<Integer> numbers) {
		int digit = 0;
		int sum = 0;
		for (int i = 0; i < limit; i++) {
			sum += (constant-i) * numbers.get(i);
		}
		digit = sum%11;
		return (11 - digit) >= 10 ? 0 : (11 - digit);
	}

}

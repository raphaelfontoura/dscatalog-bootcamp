package com.fontouradev.dscatalog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fontouradev.dscatalog.entities.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {

}

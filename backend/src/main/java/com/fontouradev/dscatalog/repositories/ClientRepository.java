package com.fontouradev.dscatalog.repositories;

import com.fontouradev.dscatalog.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {

}

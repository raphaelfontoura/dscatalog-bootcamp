package com.fontouradev.dscatalog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fontouradev.dscatalog.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

}

package com.spectrum1web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.spectrum1web.model.Role;
import com.spectrum1web.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
  
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndPasswordAndRole_RoleName(String username, String password, Role.RoleName roleName);
    List<User> findByRole_RoleName(Role.RoleName roleName);

    @Query("SELECT u FROM User u JOIN FETCH u.role WHERE u.mobileNo = :mobileNo")
    Optional<User> findByMobileNo(@Param("mobileNo") String mobileNo);
    // Count users by status
    @Query("SELECT u.status, COUNT(u) FROM User u GROUP BY u.status")
    List<Object[]> countUsersByStatus();
}
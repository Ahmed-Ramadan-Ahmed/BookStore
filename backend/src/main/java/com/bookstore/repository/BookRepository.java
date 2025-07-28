package com.bookstore.repository;

import com.bookstore.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Spring Data JPA automatically provides CRUD methods (save, findById, findAll, deleteById, etc.)
    // You can add custom query methods here if needed, e.g.,
    // List<Book> findByTitleContainingIgnoreCase(String title);
}
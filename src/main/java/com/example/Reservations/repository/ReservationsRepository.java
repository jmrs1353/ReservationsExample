package com.example.Reservations.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Reservations.model.Reservation;


public interface  ReservationsRepository extends JpaRepository<Reservation, Long> {
	
	List<Reservation> findByName(String Name);
	
}

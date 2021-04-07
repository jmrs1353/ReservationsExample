package com.example.Reservations.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Reservations.model.Reservation;
import com.example.Reservations.repository.ReservationsRepository;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/")
public class ApiController  {

	
	@Autowired
	ReservationsRepository reservationsRepository;
	
	
	@GetMapping("/reservations")
	public ResponseEntity<List<Reservation>> getAllReservations(@RequestParam(required = false) String name){
		try {
			List<Reservation> reservations = new ArrayList<Reservation>();

			if (name == null)
				reservationsRepository.findAll().forEach(reservations::add);
			else
				reservationsRepository.findByName(name).forEach(reservations::add);

			if (reservations.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>(reservations, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/reservations/{id}")
	public ResponseEntity<Reservation> getTutorialById(@PathVariable("id") long id) {
		Optional<Reservation> tutorialData = reservationsRepository.findById(id);

		if (tutorialData.isPresent()) {
			return new ResponseEntity<>(tutorialData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
}

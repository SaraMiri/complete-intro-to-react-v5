import React, { useState, useEffect, useContext } from "react";
import pf, { ANIMALS } from "petfinder-client";
import useDropdown from "./useDropDown";
import Results from "./Results";
import ThemeContext from "./ThemeContext";

const petfinder = pf({
  secret: process.env.API_SECRET,
  key: process.env.API_KEY
});
const SearchParams = () => {
  const [theme, setTheme] = useContext(ThemeContext);
  const [pets, setPets] = useState([]);
  const [location, setLocation] = useState("Seattle, WA");
  const [breeds, setBreeds] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);
  const [breed, BreedDropdown, setBreed] = useDropdown(
    "Breed",
    "Havanese",
    breeds
  );

  async function requestPets() {
    const res = await petfinder.pet.find({
      location,
      breed,
      animal,
      output: "full"
    });

    setPets(res.petfinder.pets.pet);
  }

  useEffect(() => {
    setBreed("");
    setBreed([]);
    petfinder.breed.list({ animal }).then(res => {
      setBreeds(res.petfinder.breeds.breed);
    }, console.error);
  }, [animal]);

  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault();
          requestPets();
        }}
      >
        <label htmlFor={"location"}>
          Location
          <input
            id="location"
            value={location}
            placeholder="Location"
            onChange={event => setLocation(event.target.value)}
          />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <label htmlFor={"theme"}>
          Theme
          <select
            id="theme"
            value={theme}
            onChange={event => setTheme(event.target.value)}
            onBlur={event => setTheme(event.target.value)}
          >
            <option value="darkblue">Dark Blue</option>
            <option value="peru">Peru</option>
            <option value="mediumaquamarine">Medium Aquamarine</option>
            <option value="rebeccapurple">Rebecca Purple</option>
          </select>
        </label>
        <button style={{ backgroundColor: theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;

require("dotenv").config();
const database = require("./database");
const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    color: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    color: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;
  database
  .query(
    "update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
    [title, director, year, color, duration, id]
  )
  .then(([result]) => {
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
};

const getMovies = (req, res) => {
let sql = "select * from movies";
const sqlValues = [];

if (req.query.color != null) {
  sql += " where color = ?";
  sqlValues.push(req.query.color);

  if (req.query.max_duration != null) {
    sql += " and duration <= ?";
    sqlValues.push(req.query.max_duration);
  }
} else if (req.query.max_duration != null) {
  sql += " where duration <= ?";
  sqlValues.push(req.query.max_duration);
}

database
  .query(sql, sqlValues)
  .then(([movies]) => {
    res.json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error retrieving data from the database");
  });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;
  database
  .query(
    "update users set firstname = ?, lastname = ?, email = ?, city= ?, language = ? where id = ?",
    [firstname, lastname, email, city, language,id]
  )
  .then(([result]) => {
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
};

const getUsers = (req, res) => {
  let sql = "select * from users";
  const sqlValues = [];
  
  if (req.query.language != null) {
    sql += " where language = ?";
    sqlValues.push(req.query.language);
  
    if (req.query.city != null) {
      sql += " and city = ?";
      sqlValues.push(req.query.city);
    }
  } else if (req.query.city != null) {
    sql += " where city = ?";
    sqlValues.push(req.query.city);
  }
  
  database
    .query(sql, sqlValues)
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from the database");
    });
  };

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};
const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const deleteMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from movies where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const deleteUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from users where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};


module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUsersById,
  postMovie,
  postUser,
  updateMovie,
  updateUser,
  deleteMovieById,
  deleteUserById,
};
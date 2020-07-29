CREATE TABLE folders (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);
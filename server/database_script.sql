create sequence books_seq;
create table books(
   id integer PRIMARY KEY DEFAULT nextval('books_seq'),
   title varchar(140),
   author varchar(140),
   blurb text
);

create sequence users_seq;
create table users(
  id integer PRIMARY KEY DEFAULT nextval('users_seq'),
  user_id varchar(21) NOT NULL,
  first_name varchar(50),
  last_name varchar(50),
  access_token varchar(150)
);

create sequence lists_seq;
create table lists(
   id integer PRIMARY KEY DEFAULT nextval('lists_seq'),
   list_name varchar(50) NOT NULL,
   tags text,
   likes_counter integer DEFAULT 0
);

create sequence lists_users_seq;
create table lists_to_users(
  id integer PRIMARY KEY DEFAULT nextval('lists_users_seq'),
  list_id int NOT NULL references lists(id) ON DELETE CASCADE,
  user_id int NOT NULL references users(id) ON DELETE CASCADE,
  created_flag boolean DEFAULT true,
  liked_flag boolean DEFAULT true
);

create sequence books_lists_seq;
create table books_to_lists(
   id integer PRIMARY KEY DEFAULT nextval('books_lists_seq'),
   list_id int NOT NULL references lists(id) ON DELETE CASCADE,
   book_id int NOT NULL references books(id) ON DELETE CASCADE
);

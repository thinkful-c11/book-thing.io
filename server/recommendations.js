'use strict';

const myList = {
  list_id: 42,
  list_name: 'Sci-fi',
  tags: '#scifi#space#funny#robots',
  likes_counter: 42,
  books: [
    {
      book_id: 1,
      title: "Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      blurb: "Marvin is the mopiest robot, ever!"
    },
    {
      book_id: 2,
      title: "I, Robot",
      author: "Isaac Asimov",
      blurb: "Save me from this AI madness"
    }
  ]
};

const otherLists = [
    
  {
    list_id: 17,
    list_name: "YA fiction",
    tags: '#ya#greatbooks#love#girly',
    likes_counter: 12334354,
    books: [
      {
        book_id: 17,
        title: 'Twilight',
        author: 'Stephanie Meyer',
        blurb: 'Team Edward, 4ever!'
      },
      {
        book_id: 18,
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        blurb: 'Team Peeta, 4ever! He is the best'
      }
    ]
  }, 
  {
    list_id: 2,
    list_name: "Science fiction in Space",
    tags: "#robots#space#scifi#movies",
    likes_counter: 5,
    books : [
      {
        book_id: 35,
        title: "Do Android's Dream of Electric Sheep?",
        author: "Phillip K. Dick",
        blurb: "Must watch Blade Runner soon"
      },
      {
        book_id: 36,
        title: "Ender's Game",
        author: "Orson Scott Card",
        blurb: "WOW, the movie... just wow"
      },
      {
        book_id: 37,
        title: "Leviathan Wakes",
        author: "S.A. Corey",
        blurb: "Loved this. Can't wait to watch the show!"
      }
    ]
  }, 
  {
    list_id: 7,
    list_name: "Fun books",
    tags: "#space#scifi#dystopia#fun",
    likes_counter: 100,
    books: [
      {
        book_id: 100,
        title: "Saga, Vol 1",
        author: "Brian K. Vaughan",
        blurb: "So great! Really, really want to read more!"
      },
      {
        book_id: 101,
        title: "Ready Player One",
        author: "Ernest Cline",
        blurb: "The 80s references really make this book"
      },
      {
        book_id: 1,
        title: "Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        blurb: "42! But what is the question?"
      }
    ]
  }
];

const weightLists = (myList, otherLists) => {
     
  const filteredLists = otherLists.filter(list => {
    if( ! myList.books.every( book => {
      //console.log("list (mine/other): ", myList, list);
      return ( list.books.findIndex( ol_book => {
        //console.log("the current book on the other list: ", ol_book);
        //console.log("book id (mine/other): ", book.book_id, ol_book.book_id);
        //console.log("book titles (mine/other): ", book.title, ol_book.title);
        let result = (book.book_id === ol_book.book_id || book.title === ol_book.title);
        //console.log("this is the result: ", result);
        return result;  
      }) ) !== -1;

    }))
      return list;
  });

  console.log(filteredLists);
    
  //splits the tags string on #'s and removes the leading white space
  const tags = myList.tags.split('#').splice(1);
  console.log(tags);

  filteredLists.forEach(list => {
    let weight = 0;
    if(list.likes_counter >= myList.likes_counter)
      weight++;
    tags.forEach(tag => {
      if (list.tags.indexOf(tag) !== -1)
        weight++;
    });

    //console.log('this is the list name: ', list.list_name);
    //console.log('this is the list weight: ', weight);
    list.weight = weight;
  });
  return filteredLists;
};

const recommendList = (weightedLists) => {

  let index, maxWeight = 0;
  weightedLists.forEach((list, i) => {
    if(list.weight > maxWeight){
      maxWeight = list.weight;
      index = i;
    }
  });
  return weightedLists[index];
};

module.exports = {weightLists, recommendList};
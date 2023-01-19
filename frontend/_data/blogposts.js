const fetch = require("node-fetch");

// function to get blogposts
async function getAllBlogposts() {
  // max number of records to fetch per query
  const recordsPerQuery = 100;

  // number of records to skip (start at 0)
  let recordsToSkip = 0;

  let makeNewQuery = true;

  let blogposts = [];

  // make queries until makeNewQuery is set to false
  while (makeNewQuery) {
    try {
      // initiate fetch
      const data = await fetch("http://localhost:1337/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: ` {
            articles {
              data  {
                attributes {
                  title
                  content
                  createdAt
                  slug
                }
              }
            }
          }`,
        }),
      });

      // store the JSON response when promise resolves
      const response = await data.json();

      // handle CMS errors
      if (response.errors) {
        let errors = response.errors;
        errors.map((error) => {
          console.log(error.message);
        });
        throw new Error("Houston... We have a CMS problem");
      }

      // update blogpost array with the data from the JSON response
      blogposts = blogposts.concat(response.data.articles.data);
      console.log(response.data.articles.data, blogposts[0].attributes.slug);
      // prepare for next query
      recordsToSkip += recordsPerQuery;

      // stop querying if we are getting back less than the records we fetch per query
      // console.log(response.data.articles);
      if (response.data.articles.data.length < recordsPerQuery) {
        makeNewQuery = false;
      }

      //changed to stop LOOP!!! caused by above code
      // makeNewQuery = false;
    } catch (error) {
      throw new Error(error);
    }
  }

  // format blogposts objects
  const blogpostsFormatted = blogposts.map((item) => {
    return {
      id: item.attributes.id,
      title: item.attributes.title,
      slug: item.attributes.slug,
      body: item.attributes.content,
      author: item.attributes.author,
      date: item.attributes.published_at,
    };
  });

  // return formatted blogposts
  return blogpostsFormatted;
}

// export for 11ty
module.exports = getAllBlogposts;

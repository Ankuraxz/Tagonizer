import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import cheerio from "cheerio";
import axios from "axios";

import NavBar from "./NavBar";

import OverallContext from "./context/overallContext";

import Tags from "./Tags";

const overallDiVStyles = {
  width: "400px",
  height: "545px",
  padding: "20px",
};

let url = "";
let sellerImages = [];
chrome.storage.sync.get(["tab", "sellerImages"], function(items) {
  console.log("Data retrieved in react", items);
  url = items.tab;
  sellerImages = [...items.sellerImages];
  console.log(url);
});

function App() {
  const api = "https://tagonizer.herokuapp.com";
  const [reviews, setReviews] = useState([]);
  const [customerImages, setCustomerImages] = useState([]);
  const [data , setData] = useState();

  useEffect(() => {
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const $ = cheerio.load(text);
        const arr = [];
        $("#cm_cr-review_list .review-text-content")
          .children()
          .each(function(i) {
            arr.push(
              $(this)
                .text()
                .replace(/(\r\n|\n|\r)/gm, "")
                .trim()
            );
          });
        console.log(arr);

        //fetch images
        const imgSrc = [];
        imgSrc.push($(".review-image-tile-section .review-image-tile").attr("src"))
        console.log(imgSrc);

        setCustomerImages(imgSrc);
        setReviews(arr);
      });
  }, [url]);

 useEffect(()=> {
   if(reviews.length){
   const reviewsObj = {
    "comments": reviews
   }
   console.log(reviewsObj)
  axios.post(api + "/predict", reviewsObj)
  .then(res => {
    console.log(res.data);
    setData(res.data);
  });
}
 },[reviews])

  const arrayTemp = [
    [
      "i received defective iphone 7 32GB silver colour d…. expecting Amazon to do quick action against it.",
      "Thanks for Amazon service. phone is very nice and …n gaming. Compare to other phones this is superb.",
      "Redmi phones cameras are great, of course iPhone i…he best value for money among all phones in India",
      "If you are an apple fan !! This is a true beauty to go for !!",
      "in 20 days i found my battery health 98% which was…y apple device which is very worst battery setup.",
      "Totally disappointed within a month paint started …a month passed.I want my refund from this seller.",
      "First of all one would want to know is the product…orking greatDelivery was also quick in 03 days ..",
      "Very good specs which can handle updates for next …r long durations ,camera definitely upto the mark",
      "Everything is awesome when it comes to an iphone. …s in not having FaceID.Go for iphone X or higher.",
      "This iPhone7 is in hearing problems. What Can I do",
    ],
  ];
  const [state, setState] = useState(arrayTemp);

  return (
    <OverallContext.Provider value={{ state, setState }}>
      <div style={overallDiVStyles}>
        <Router>
          <NavBar />
          <Switch>
            <Route path="/" exact>
              <Tags />
            </Route>
            <Route path="/reviews" exact>
              <p>reviews</p>
            </Route>
            <Route path="/images" exact>
              <p>images</p>
            </Route>
          </Switch>
        </Router>
      </div>
    </OverallContext.Provider>
  );
}

export default App;

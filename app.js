import { Comment } from "./comment.js";

let commentsArr = [];
document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    //once dom is loaded .
    //read from localstorage
    loadFromLocalStorage();
    //render the commentbox and comment list.
    let handle = document.getElementById("handle");
    let name = document.getElementById("name");

    let submitCommentBtn = document.getElementById("submitCommentBtn");
    let commentBox = document.getElementById("commentBox");
    submitCommentBtn.addEventListener("click", () =>
      addComment(name.value, handle.value, commentBox.value, null)
    );

    renderComments();
    // add event listeners to show the reply form , add new reply , upvote and downvote
    let commentslist = document.getElementById("commentslist");
    commentslist.addEventListener("click", (event) => {
      let [type, parentId] = event.target.id.split("-");
      let childCommentsList = document.getElementById(
        `childCommentsList-${parentId}`
      );
      if (event.target.nodeName === "A") {
        //should be one of reply upvote or downvote.

        if (type === "reply") {
          let htmlStr = `<section class="commentboxheader" id="commentboxheader-${parentId}">
            <label for="name-${parentId}"></label>
            <input id="name-${parentId}" placeholder="Name" class="name-handle"></input>
            <label for="handle-${parentId}"></label>
            <input id="handle-${parentId}" placeholder="Handle" class="name-handle"></input>
            </section>
        <section class="commentbox"><textarea id="commentBox-${parentId}" rows="5" cols="30"></textarea>
            <button id="submitCommentBtn-${parentId}">Submit</button>
        </section>`;
          //does childcomment exist already'

          if (childCommentsList) {
            childCommentsList.innerHTML = htmlStr + childCommentsList.innerHTML;
          } else {
            let parentContainer = document.getElementById(
              `commentContainer-${parentId}`
            );
            if (parentContainer) {
              parentContainer.innerHTML += htmlStr;
            }
          }
        } else if (type === "upvote") {
          commentsArr[parentId].upvotes = commentsArr[parentId].upvotes + 1;
          storeToLocalStorage();
          renderComments();
        } else if (type === "downvote") {
          commentsArr[parentId].downvotes = commentsArr[parentId].downvotes + 1;
          storeToLocalStorage();
          renderComments();
        }
      } else if (event.target.nodeName === "BUTTON") {
        addComment(
          document.getElementById(`name-${parentId}`).value,
          document.getElementById(`handle-${parentId}`).value,
          document.getElementById(`commentBox-${parentId}`).value,
          parentId
        );
      }
    });
  }
});
export const storeToLocalStorage = () => {
  localStorage.setItem("comments", JSON.stringify(commentsArr));
};
export const loadFromLocalStorage = () => {
  const commentsStored = localStorage.getItem("comments");
  if (commentsStored) {
    try {
      commentsArr = JSON.parse(commentsStored);
      for (let i = 0; i < commentsArr.length; i++) {
        commentsArr[i].updatedAt = new Date(commentsArr[i].updatedAt);
      }
    } catch (e) {
      commentsArr = [];
    }
  }
};
export const formatDate = (date) => {
  let delta = Date.now() - date.valueOf();

  if (delta < 20000) {
    return "few seconds ago";
  } else if (delta < 120000) {
    return "few mins ago";
  } else if (delta < 3600000) {
    return "an hour ago";
  } else if (delta < 86400000) {
    return "few hours ago";
  } else if (delta < 270000000) {
    return "a month ago";
  }
  return date.toDateString();
};
export const renderComment = (parentId, id) => {
  //comment being rendered commentsArr[id];
  console.log("rendering child ", id, commentsArr[id]);
  let htmlStr = `
        <li class="comment" id="commentContainer-${id}" > 
        <div class="name-handle commentboxheader" id="details-${id}">
        <div>
           Posted by : ${commentsArr[id].handle}
        </div>
        <div>
            Date : ${formatDate(commentsArr[id].updatedAt)}
        </div>
        </div>
        ${commentsArr[id].value}
        <div>
        <div class="rightalign">
        <div class="linkstyle">
        <a href="#"  id="upvote-${id}" >Upvote</a>(${
    commentsArr[id].upvotes
  })</div>
  <div class="linkstyle">
        <a href="#"  id="downvote-${id}" >Downvote</a>(${
    commentsArr[id].downvotes
  }) </div>
  <div class="linkstyle">
        <a href="#" class="linkstyle"  id="reply-${id}" >Reply</a>
        </div>
        </div>
        </div>  
    `;

  if (commentsArr[id].children?.length > 0) {
    htmlStr += `<ul id="childCommentsList-${id}">`;
    for (let i = 0; i < commentsArr[id].children?.length; i++) {
      console.log("child", commentsArr[id].children[0]);
      htmlStr += renderComment(id, commentsArr[id].children[i]);
    }
    htmlStr += `</ul>`;
  }
  htmlStr += "</li>";

  return htmlStr;
};

export const renderComments = () => {
  let htmlStr = `<ul>`;
  //get all parent comments

  for (let i = 0; i < commentsArr.length; i++) {
    if (commentsArr[i].parent === "null" || commentsArr[i].parent == null) {
      //this is a parent comment.
      htmlStr += `${renderComment(null, i)}`;
    }
  }
  htmlStr += `</ul>`;
  let commentslist = document.getElementById("commentslist");
  commentslist.innerHTML = htmlStr;
  return htmlStr;
};

export const addComment = (name, handle, value, parentId) => {
  let newComment = new Comment(
    value,
    name,
    handle,
    commentsArr.length,
    parentId,
    0,
    0
  );

  commentsArr.push(newComment);
  if (parentId) {
    if (commentsArr[parentId].children?.length) {
      commentsArr[parentId].children.push(commentsArr.length - 1);
    } else {
      commentsArr[parentId].children = [commentsArr.length - 1];
    }
  }
  storeToLocalStorage();

  renderComments();
};

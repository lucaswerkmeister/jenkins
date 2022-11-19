Behaviour.specify(
  "A.confirmation-link",
  "confirmation-link",
  0,
  function (element) {
    element.onclick = function () {
      var post = element.getAttribute("data-post");
      var href = element.getAttribute("data-url");
      var message = element.getAttribute("data-message");

      const options = {
        title: message,
        post: post,
        action: href
      }

      showConfirmationModal(options);

      return false;
    };
  }
);

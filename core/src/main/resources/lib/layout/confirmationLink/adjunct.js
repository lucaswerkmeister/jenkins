Behaviour.specify(
  "A.confirmation-link",
  "confirmation-link",
  0,
  function (element) {
    element.onclick = function () {
      const post = element.getAttribute("data-post");
      const href = element.getAttribute("data-url");
      const message = element.getAttribute("data-message");
      const type = element.getAttribute("data-confirmation-type");

      const options = {
        title: message,
        post: post,
        action: href,
        type: type | 'default'
      }

      showConfirmationModal(options);

      return false;
    };
  }
);

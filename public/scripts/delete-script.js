let deleteButton = document.querySelector(".delete-button");
let deleteConfirmed = document.querySelector(".delete-confirmed");

deleteButton.addEventListener("click", function(){
  if (confirm("Are you sure you want to delete this?")){
    deleteConfirmed.click();
  }
});

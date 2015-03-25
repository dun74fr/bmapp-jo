angular.module('starter.services', ['ngResource'])

.factory('Contact', function ($resource) {
	return $resource('http://localhost:8080/bm/bmapp/ContactREST.do');
});

// http://localhost:8080/bm/contacts/ContactPerson/Forward/Update.do?
// dto(addressId)=106&
// dto(contactPersonId)=108&
// contactId=106&
// dto(addressType)=0&
// dto(name1)=%C3%84zero&dto(name2)=Pablo&
// dto(name3)=&
// tabKey=Contacts.Tab.contactPersons
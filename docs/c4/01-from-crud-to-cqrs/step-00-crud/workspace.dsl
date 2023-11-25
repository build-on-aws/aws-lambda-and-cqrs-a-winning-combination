workspace {
  model {
    customer = person "Borrower" "End-user that returns and borrows books" "Customer"

    group "Library" {
      librarian = person "Librarian" "Responsible for managing the library" "Library Staff"

      email = softwaresystem "E-mail System" "The internal e-mail system" "Existing System"

      librarySystem = softwareSystem "Library System" "Responsible for storage and exposing operations on books, users, and authors" {
        singlePageApplication = container "Single-Page Application" "Provides all of the online library functionality to customers via their web browser" "JavaScript and React" "Web Browser"
        webServer = container "Web Server" "Serves the single-page application to the customers" "Node.js and Express" "Web Server"

        apiApplication = container "API Application" "Provides library functionality via a REST API (HTTPS + JSON)" "Node.js and TypeScript" {
          authorController = component "Author Controller" "Provides relevant management actions for book authors" "Controller"
          bookController = component "Book Controller" "Provides relevant management actions for books" "Controller"
          rentalController = component "Rental Controller" "Provides relevant management actions for rentals" "Controller"
          userController = component "User Controller" "Provides relevant management actions for users" "Controller"

          databaseProvider = component "Database Provider" "Provides an abstraction over database access (Amazon DynamoDB API)" "Provider"
        }

        database = container "Database Layer" "Stores authors, books, rentals, and users" "Amazon DynbamoDB" "Database" {
          librarySystemTable = component "Library System Table" "Single Table Design that represents entities in the library domain" "Amazon DynamoDB Table" "Table"
          gsi1 = component "Entity Type Index" "Global Secondary Index (GSI) that allows for querying by the entity type and sort key" "Amazon DynamoDB Global Secondary Index (GSI)" "Index"
          gsi2 = component "Entity Status Index" "Global Secondary Index (GSI) that allows for querying by the entity type and status" "Amazon DynamoDB Global Secondary Index (GSI)" "Index"
        }
      }

      customer -> librarian "Asks questions to" "Conversation"
      librarian -> librarySystem "Manages library and all the assets"
      customer -> librarySystem "Searches, returns and borrows books"

      email -> customer "Sends e-mails to" "Email Notification"
      email -> librarian "Sends e-mails to" "Email Notification"

      librarian -> webServer "Visits 'library-app.com/admin' using" "HTTPS"
      customer -> webServer "Visits 'library-app.com' using" "HTTPS"

      librarian -> singlePageApplication "Manages all the books, authors and customers of the library"
      customer -> singlePageApplication "Lists overall available books and listing books borrowed by this customer" "Read-Only"

      webServer -> singlePageApplication "Delivers to the user's web browser"
      singlePageApplication -> apiApplication "Interacts with books via prepared API" "REST API"

      librarySystem -> email "Sends e-mail using" "Email Notification"

      singlePageApplication -> authorController "Makes API calls to" "JSON/HTTPS"
      singlePageApplication -> bookController "Makes API calls to" "JSON/HTTPS"
      singlePageApplication -> rentalController "Makes API calls to" "JSON/HTTPS"
      singlePageApplication -> userController "Makes API calls to" "JSON/HTTPS"

      authorController -> databaseProvider "Put, Get, Update, Delete, and Query operations"
      bookController -> databaseProvider "Put, Get, Update, Delete, and Query operations"
      rentalController -> databaseProvider "Put, Get, Update, Delete, and Query operations"
      userController -> databaseProvider "Put, Get, Update, Delete, and Query operations"

      databaseProvider -> librarySystemTable "Put, Get, Update, Delete, and Query" "JSON/HTTPS"
      databaseProvider -> gsi1 "Query from" "JSON/HTTPS"
      databaseProvider -> gsi2 "Query from" "JSON/HTTPS"

      librarySystemTable -> gsi1 "Asynchronous Replication"
      librarySystemTable -> gsi2 "Asynchronous Replication"
    }
  }

  views {
    systemlandscape "SystemLandscape" {
      include *
      autoLayout
    }

    systemContext librarySystem "SystemContext" {
      include *
      autoLayout
      description "The system context diagram for the Library System"
      properties {
        structurizr.groups false
      }
    }

    container librarySystem "Containers" {
      include *
      autoLayout
      description "The container diagram for the Library System"
    }

    component apiApplication "APIApplicationComponents" {
      include *
      autoLayout
      description "The component diagram for the API Application"
    }

    component database "DatabaseLayerComponents" {
      include *
      autoLayout
      description "The component diagram for the Database Layer"
    }

    styles {
      element "Person" {
        color #ffffff
        fontSize 22
        shape person
      }

      element "Customer" {
        background #444444
      }

      element "Library Staff" {
        background #999999
      }

      element "Software System" {
        background #1168bd
        color #ffffff
      }

      element "Existing System" {
        background #999999
        color #ffffff
      }

      element "Container" {
        background #438dd5
        color #ffffff
      }

      element "Web Server" {
        background #999999
        color #ffffff
      }

      element "Web Browser" {
        background #999999
        color #ffffff
        shape WebBrowser
      }

      element "Database" {
        shape Cylinder
      }

      element "Service" {
        background #999999
        color #ffffff
      }

      element "Component" {
        background #85bbf0
        color #000000
      }

      element "Table" {
        shape Cylinder
      }

      element "Index" {
        shape Cylinder
        background #bcdefe
        stroke #000000
        border dashed
      }
    }
  }
}

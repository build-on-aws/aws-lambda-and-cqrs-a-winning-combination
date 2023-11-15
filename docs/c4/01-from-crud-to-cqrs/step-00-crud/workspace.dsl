workspace {
  model {
    customer = person "Borrower" "End-user that returns and borrows books." "Customer"

    group "Library" {
      librarian = person "Librarian" "Responsible for managing the library." "Library Staff"

      email = softwaresystem "E-mail System" "The internal e-mail system." "Existing System"
      kiosk = softwaresystem "Self-Service Kiosk" "Self-service kiosk for searching, and borrowing books on-site." "Kiosk"

      librarySystem = softwareSystem "Library System" "Responsible for storage and exposing operations on books, users, and authors." {
        singlePageApplication = container "Single-Page Application" "Provides all of the online library functionality to customers via their web browser." "JavaScript and React" "Web Browser"
        webServer = container "Web Server" "Serves the single-page application to the customers." "Node.js and Express" "Web Server"
        apiApplication = container "API Application" "Provides library functionality via a REST API (HTTPS + JSON)." "Node.js and Express" {
          authorController = component "Author Controller" "Provides relevant management actions for book authors." "Controller"
          bookController = component "Book Controller" "Provides relevant management actions for books." "Controller"
          userController = component "User Controller" "Provides relevant management actions for users." "Controller"
          emailComponent = component "E-mail Component" "Sends e-mails to users." "Service"
        }
        database = container "Database" "Stores users, authors, books, etc." "Amazon DynbamoDB" "Database"
      }

      customer -> librarian "Asks questions to" "Conversation"
      librarian -> librarySystem "Manages library and all the assets"
      customer -> kiosk "Searches, returns and borrows books"

      email -> customer "Sends e-mails to" "Email Notification"
      email -> librarian "Sends e-mails to" "Email Notification"

      kiosk -> librarySystem "Invoking operations on the library assets on behalf of the customer"

      librarian -> webServer "Visits 'library-app.com/admin' using" "HTTPS"
      customer -> webServer "Visits 'library-app.com' using" "HTTPS"

      librarian -> singlePageApplication "Manages all the books, authors and customers of the library"
      customer -> singlePageApplication "Lists overall available books and listing books borrowed by this customer" "Read-Only"

      webServer -> singlePageApplication "Delivers to the user's web browser"
      kiosk -> apiApplication "Interacts with books via prepared API" "REST API"

      kiosk -> authorController "Makes API calls to" "JSON/HTTPS"
      kiosk -> bookController "Makes API calls to" "JSON/HTTPS"
      kiosk -> userController "Makes API calls to" "JSON/HTTPS"

      singlePageApplication -> authorController "Makes API calls to" "JSON/HTTPS"
      singlePageApplication -> bookController "Makes API calls to" "JSON/HTTPS"
      singlePageApplication -> userController "Makes API calls to" "JSON/HTTPS"

      authorController -> database "Reads from and writes to" "JSON/HTTPS"
      bookController -> database "Reads from and writes to" "JSON/HTTPS"
      userController -> database "Reads from and writes to" "JSON/HTTPS"

      userController -> emailComponent "Uses"
      bookController -> emailComponent "Uses"

      emailComponent -> email "Sends e-mail using" "Email Notification
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
      description "The system context diagram for the Library System."
      properties {
        structurizr.groups false
      }
    }

    container librarySystem "Containers" {
      include *
      autoLayout
      description "The container diagram for the Library System."
    }

    component apiApplication "Components" {
      include *
      autoLayout
      description "The component diagram for the API Application."
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

      element "Kiosk" {
        background #999999
        color #ffffff
        shape MobileDevicePortrait
      }

      element "Web Browser" {
        background #999999
        color #ffffff
        shape WebBrowser
      }

      element "Database" {
        shape Cylinder
      }

      element "Component" {
        background #85bbf0
        color #000000
      }
    }
  }
}
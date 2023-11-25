workspace {
  model {
    properties {
      "structurizr.groupSeparator" "/"
    }

    customer = person "Borrower" "End-user that returns and borrows books" "Customer"

    group "Library" {
      librarian = person "Librarian" "Responsible for managing the library" "Library Staff"

      librarySystem = softwareSystem "Library System" "Responsible for storage and exposing operations on books, users, and authors" {
        singlePageApplication = container "Single-Page Application" "Provides all of the online library functionality to customers via their web browser" "JavaScript and React" "Web Browser"

        apiGateway = container "API Gateway" "Serves the single-page application to the customers" "Amazon API Gateway" "Web Server"

        domainServices = container "Library Domain Services" "CQRS Architecture" "Node.js and TypeScript" {
          group "Dispatchers" {
            commandsDispatcher = component "Commands Dispatcher" "Service that based on the context creates and dispatches a command" "Commands Dispatcher" "Commands Dispatcher"
            queriesDispatcher = component "Queries Dispatcher" "Service that based on the context creates and dispatches a query" "Queries Dispatcher" "Queries Dispatcher"
          }

          group "Factories" {
            commandHandlersFactory = component "Command Handlers Factory" "Supporting service responsible for creating commands" "Command Handlers Factory" "Command Handlers Factory"
            queryHandlersFactory = component "Query Handlers Factory" "Supporting service responsible for creating queries" "Query Handlers Factory" "Query Handlers Factory"
            repositoriesFactory = component "Repositories Factory" "Supporting service responsible for creating repositories" "Repositories Factory" "Repositories Factory"
          }

          group "Commands" {
            addNewBookCommand = component "AddNewBook Command" "Object that contains necessary inputs and performs essential validation" "Command" "Command"
            borrowBookCommand = component "BorrowBook Command" "Object that contains necessary inputs and performs essential validation" "Command" "Command"
            reportMissingBookCommand = component "ReportMissingBook Command" "Object that contains necessary inputs and performs essential validation" "Command" "Command"
          }

          group "Command Handlers" {
            addNewBookCommandHandler = component "AddNewBook Command Handler" "Execution mechanism for a given command" "Command Handler" "Command Handler"
            borrowBookCommandHandler = component "BorrowBook Command Handler" "Execution mechanism for a given command" "Command Handler" "Command Handler"
            reportMissingBookCommandHandler = component "ReportMissingBook Command Handler" "Execution mechanism for a given command" "Command Handler" "Command Handler"
          }

          group "Queries" {
            getBooksByAuthorQuery = component "GetBooksByAuthor Query" "Object that contains necessary inputs and performs essential validation" "Query" "Query"
            getBorrowedBooksForUserQuery = component "GetBorrowedBooksForUser Query" "Object that contains necessary inputs and performs essential validation" "Query" "Query"
            getMissingBooksQuery = component "GetMissingBooks Query" "Object that contains necessary inputs and performs essential validation" "Query" "Query"
          }

          group "Query Handlers" {
            getBooksByAuthorQueryHandler = component "AddNewBook Query Handler" "Execution mechanism for a given query" "Query Handler" "Query Handler"
            getBorrowedBooksForUserQueryHandler = component "BorrowBook Query Handler" "Execution mechanism for a given query" "Query Handler" "Query Handler"
            getMissingBooksQueryHandler = component "ReportMissingBook Query Handler" "Execution mechanism for a given query" "Query Handler" "Query Handler"
          }

          group "Repositories" {
            authorRepository = component "Author Repository" "Database operations on collection of authors" "Repository" "Repository"
            bookRepository = component "Book Repository" "Database operations on collection of books" "Repository" "Repository"
            rentalRepository = component "Rental Repository" "Database operations on collection of rentals" "Repository" "Repository"
            userRepository = component "User Repository" "Database operations on collection of users" "Repository" "Repository"
          }

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

      librarian -> singlePageApplication "Manages all the books, authors and customers of the library"
      customer -> singlePageApplication "Lists overall available books and listing books borrowed by this customer" "Read-Only"

      singlePageApplication -> apiGateway "Interacts with books via prepared API" "REST API"

      apiGateway -> commandsDispatcher "Dispatch command"
      apiGateway -> queriesDispatcher "Dispatch query"

      commandsDispatcher -> commandHandlersFactory "Create and dispatch command"
      queriesDispatcher -> queryHandlersFactory "Create and dispatch query"

      commandHandlersFactory -> repositoriesFactory "Creates necessary repositories"
      commandHandlersFactory -> addNewBookCommand "Creates"
      commandHandlersFactory -> borrowBookCommand "Creates"
      commandHandlersFactory -> reportMissingBookCommand "Creates"

      queryHandlersFactory -> repositoriesFactory "Creates necessary repositories"
      queryHandlersFactory -> getBooksByAuthorQuery "Creates"
      queryHandlersFactory -> getBorrowedBooksForUserQuery "Creates"
      queryHandlersFactory -> getMissingBooksQuery "Creates"

      addNewBookCommand -> addNewBookCommandHandler "Handle command"
      borrowBookCommand -> borrowBookCommandHandler "Handle command"
      reportMissingBookCommand -> reportMissingBookCommandHandler "Handle command"

      getBooksByAuthorQuery -> getBooksByAuthorQueryHandler "Handle query"
      getBorrowedBooksForUserQuery -> getBorrowedBooksForUserQueryHandler "Handle query"
      getMissingBooksQuery -> getMissingBooksQueryHandler "Handle query"

      addNewBookCommandHandler -> authorRepository "Get or create new author"
      addNewBookCommandHandler -> bookRepository "Create new book"

      borrowBookCommandHandler -> rentalRepository "Get and create new rental"
      borrowBookCommandHandler -> userRepository "Get user"

      reportMissingBookCommandHandler -> rentalRepository "Get and delete an existing rental"
      reportMissingBookCommandHandler -> userRepository "Get user"
      reportMissingBookCommandHandler -> bookRepository "Update book status and add comment"

      getBooksByAuthorQueryHandler -> bookRepository "Get books by a given author"

      getBorrowedBooksForUserQueryHandler -> rentalRepository "Get rentals for a given user"

      getMissingBooksQueryHandler -> bookRepository "Get books by status"

      repositoriesFactory -> authorRepository "Creates"
      repositoriesFactory -> bookRepository "Creates"
      repositoriesFactory -> rentalRepository "Creates"
      repositoriesFactory -> userRepository "Creates"

      authorRepository -> databaseProvider "Put, Get, Update, Delete, and Query operations"
      bookRepository -> databaseProvider "Put, Get, Update, Delete, and Query operations"
      rentalRepository -> databaseProvider "Put, Get, Update, Delete, and Query operations"
      userRepository -> databaseProvider "Put, Get, Update, Delete, and Query operations"

      databaseProvider -> librarySystemTable "Put, Get, Update, Delete, and Query" "JSON/HTTPS"
      databaseProvider -> gsi1 "Query from" "JSON/HTTPS"
      databaseProvider -> gsi2 "Query from" "JSON/HTTPS"

      librarySystemTable -> gsi1 "Asynchronous Replication"
      librarySystemTable -> gsi2 "Asynchronous Replication"
    }

    production = deploymentEnvironment "Production" {

      deploymentNode "Amazon Web Services" {
        tags "Amazon Web Services - Cloud"

        region = deploymentNode "eu-west-1" {
          tags "Amazon Web Services - Region"

          route53 = infrastructureNode "Custom Domain" {
            description "Highly available and scalable cloud DNS service"
            tags "Amazon Web Services - Route 53"
          }

          group "Library System" {

            deploymentNode "Single-Page Application" {
              description "Hosting for the prepared front-end application"
              tags "Amazon Web Services - Amplify"

              singlePageApplicationDeployment = containerInstance singlePageApplication
            }

            deploymentNode "REST API" {
              description "Scalable REST API exposing domain services for the clients"
              tags "Amazon Web Services - Amazon API Gateway"

              addNewBookEndpoint = infrastructureNode "[POST] AddNewBook Command Handler" {
                description "Endpoint responsible for handling new book creation process"
                tags "Amazon Web Services - API Gateway Endpoint"
              }

              borrowBookEndpoint = infrastructureNode "[POST] BorrowBook Command Handler" {
                description "Endpoint responsible for handling process for borrowing a book"
                tags "Amazon Web Services - API Gateway Endpoint"
              }

              reportMissingBookEndpoint = infrastructureNode "[POST] ReportMissingBook Command Handler" {
                description "Endpoint responsible for handling missing book reports"
                tags "Amazon Web Services - API Gateway Endpoint"
              }

              getBooksByAuthorEndpoint = infrastructureNode "[GET] GetBooksByAuthor Query Handler" {
                description "Endpoint responsible for querying inventory of books by a given author"
                tags "Amazon Web Services - API Gateway Endpoint"
              }

              getBorrowedBooksForUserEndpoint = infrastructureNode "[GET] GetBorrowedBooksForUser Query Handler" {
                description "Endpoint responsible for querying inventory of books based on the rentals for a given user"
                tags "Amazon Web Services - API Gateway Endpoint"
              }

              getMissingBooksEndpoint = infrastructureNode "[GET] GetMissingBooks Query Handler" {
                description "Endpoint responsible for querying inventory of books to find all missing items"
                tags "Amazon Web Services - API Gateway Endpoint"
              }
            }

            group "CQRS Dispatchers" {
              containerInstance domainServices

              commandsDispatcherFunction = infrastructureNode "CommandsDispatcher Function" {
                description "Scalable infrastructure for CQRS handlers: Commands"
                tags "Amazon Web Services - AWS Lambda Lambda Function"
              }

              queriesDispatcherFunction = infrastructureNode "QueriesDispatcher Function" {
                description "Scalable infrastructure for CQRS handlers: Queries"
                tags "Amazon Web Services - AWS Lambda Lambda Function"
              }
            }

            deploymentNode "Database" {
              description "Scalable NoSQL database"
              tags "Amazon Web Services - DynamoDB"

              databaseInstance = containerInstance database

              tableInstance = infrastructureNode "Library System Table" {
                description "Main table (Single Table Design)"
                tags "Amazon Web Services - DynamoDB Table"
              }

              gsi1Instance = infrastructureNode "GSI1: Entity Type Index" {
                description "Index that allows for searching by entity type and sort key"
                tags "Amazon Web Services - DynamoDB Global secondary index"
              }

              gsi2Instance = infrastructureNode "GSI2: Entity Status Index" {
                description "Index that allows for searching by entity type and entity status"
                tags "Amazon Web Services - DynamoDB Global secondary index"
              }
            }
          }
        }
      }

      route53 -> singlePageApplicationDeployment "Forwards requests to" "HTTPS"

      singlePageApplicationDeployment -> addNewBookEndpoint "Handles a new book creation" "HTTPS"
      singlePageApplicationDeployment -> borrowBookEndpoint "Handles borrowing an existing book" "HTTPS"
      singlePageApplicationDeployment -> reportMissingBookEndpoint "Handles reporting book as missing" "HTTPS"

      singlePageApplicationDeployment -> getBooksByAuthorEndpoint "Gets all books by a given author" "HTTPS"
      singlePageApplicationDeployment -> getBorrowedBooksForUserEndpoint "Gets all books borrowed by a given user" "HTTPS"
      singlePageApplicationDeployment -> getMissingBooksEndpoint "Gets all missing books" "HTTPS"

      addNewBookEndpoint -> commandsDispatcherFunction "Dispatching command" "ICommand"
      borrowBookEndpoint -> commandsDispatcherFunction "Dispatching command" "ICommand"
      reportMissingBookEndpoint -> commandsDispatcherFunction "Dispatching command" "ICommand"

      getBooksByAuthorEndpoint -> queriesDispatcherFunction "Dispatching query" "IQuery"
      getBorrowedBooksForUserEndpoint -> queriesDispatcherFunction "Dispatching query" "IQuery"
      getMissingBooksEndpoint -> queriesDispatcherFunction "Dispatching query" "IQuery"

      commandsDispatcherFunction -> databaseInstance "Put, Get, Update, Delete, and Query" "JSON/HTTPS"
      queriesDispatcherFunction -> databaseInstance "Query from "JSON/HTTPS"

      databaseInstance -> tableInstance "Put, Get, Update, Delete, and Query" "JSON/HTTPS"
      databaseInstance -> gsi1Instance "Query from" "JSON/HTTPS"
      databaseInstance -> gsi2Instance "Query from" "JSON/HTTPS"

      tableInstance -> gsi1Instance "Asynchronous Replication"
      tableInstance -> gsi2Instance "Asynchronous Replication"
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

    component domainServices "DomainServices" {
      include *
      autoLayout
      description "The component diagram for domain services handling API requests"
    }

    component database "DatabaseLayerComponents" {
      include *
      autoLayout
      description "The component diagram for the Database Layer"
    }

    deployment librarySystem "Production" "AmazonWebServicesDeployment" {
      include *
      autoLayout lr
      description "The cloud deployment diagram for the Library System (Amazon Web Services)"
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

      element "Commands Dispatcher" {
        background orange
      }

      element "Command" {
        background orange
      }

      element "Command Handler" {
        background orange
      }

      element "Command Handlers Factory" {
        background orange
      }

      element "Queries Dispatcher" {
        background lightGreen
      }

      element "Query" {
        background lightGreen
      }

      element "Query Handler" {
        background lightGreen
      }

      element "Query Handlers Factory" {
        background lightGreen
      }

      element "Repository" {
        shape Cylinder
      }
    }

    themes https://static.structurizr.com/themes/amazon-web-services-2023.01.31/theme.json
  }
}

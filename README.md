# nodejs-parsing-poc
Parsing proof of concept

## Theory of Operation
This parser example processes a multi-line file and treats each line as a
record. The records follow the following grammar:
* Alpha records (A) contain batch information
* Beta records (B) contain user information
* Gamma records (C) contain item information

The following grammar is recognized by this parse tree (where '...' means
'repeating'):
* A{B{C...}...}
* "Exactly one A record followed by any number of B records which are followed
by any number of C records"

Some examples of valid record sequences:
* A         - one batch, no users
* AB        - one batch, one user with no items
* ABB       - one batch, two users with no items
* ABC       - one batch, one user with one item
* ABCCCBC   - one batch, one user with three items, one user with one item

Some examples of invalid record sequences:
* BCCCC     - not preceded by an A record
* C         - not preceded by an A record
* AC        - C record is not preceded by a B record
* ABA       - more than one A record

## Algorithm
1. Read in the entire contents of a file
2. For each record/line in the file
    a. determine the type of record
    b. decode the record accordingly
    c. update the parse tree
3. Output the parse tree

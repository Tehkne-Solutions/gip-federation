## [0.1.0-alpha] - 2025-12-26
### Added
- WebSocket federation node with relay and broadcast functionality
- Docker + docker-compose for containerized deployment
- TypeScript configuration with proper ES module support
- Jest test suite with 3 passing unit tests:
  - Server startup and port binding (port 8810)
  - Client connection to federation node
  - Multi-client message relay and broadcast
- README with quickstart instructions

### Fixed
- Added `"type": "module"` to package.json to eliminate ES module warnings
- Installed TypeScript type definitions (@types/ws, @types/uuid, @types/node)

### Tested
- Test Results: ✅ 3/3 passed (4.65s execution time)
  - PASS: server starts and listens on port
  - PASS: client can connect to federation node
  - PASS: federation node relays messages between clients

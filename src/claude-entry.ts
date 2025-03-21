#!/usr/bin/env node

// This is the entry point for the Claude-specific binary
// It just imports the claude-transport module which sets up
// the MCP server with a stdio transport

import './claude-transport.js';

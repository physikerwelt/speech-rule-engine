// Copyright 2016 Volker Sorge
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Supported by the Mozilla Foundation.

/**
 * @fileoverview Factory for trie nodes and concrete classes of trie nodes.
 *
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

goog.provide('sre.BooleanTrieNode');
goog.provide('sre.DynamicTrieNode');
goog.provide('sre.QueryTrieNode');
goog.provide('sre.RootTrieNode');
goog.provide('sre.TrieNodeFactory');

goog.require('sre.AbstractTrieNode');
goog.require('sre.ConstraintTrieNode');

// @param {sre.SpeechRule} rule The speech rule the trie node is associated
//     with.


/**
 * Generates a trie node of a given kind in the given rule store.
 * @param {sre.TrieNode.Kind} kind The kind of trie nodes.
 * @param {string} constraint The constraint the trie node is generated for.
 * @param {sre.SpeechRuleStore} store The rule store.
 * @return {?sre.TrieNode} The newly generated trie node.
 */
sre.TrieNodeFactory.getNode = function(kind, constraint, store) {
  switch (kind) {
    case sre.TrieNode.Kind.ROOT:
      return new sre.RootTrieNode();
    case sre.TrieNode.Kind.DYNAMIC:
      return new sre.DynamicTrieNode(constraint);
    case sre.TrieNode.Kind.QUERY:
      return new sre.QueryTrieNode(constraint, store);
    case sre.TrieNode.Kind.BOOLEAN:
      return new sre.BooleanTrieNode(constraint, store);
    default:
      return null;
  }
};


// TODO (MOSS) Think about dispersing into multiple files.

/**
 * @constructor
 * @extends {sre.AbstractTrieNode}
 */
sre.RootTrieNode = function() {
  sre.RootTrieNode.base(this, 'constructor', '',
                        function() {return true;});
  this.kind = sre.TrieNode.Kind.ROOT;
};
goog.inherits(sre.RootTrieNode, sre.AbstractTrieNode);


/**
 * @constructor
 * @extends {sre.AbstractTrieNode<sre.Engine.Axis>}
 * @param {string} constraint The constraint the node represents.
 */
sre.DynamicTrieNode = function(constraint) {
  sre.DynamicTrieNode.base(this, 'constructor', constraint,
                        function(axis) {return axis === constraint;});
  this.kind = sre.TrieNode.Kind.DYNAMIC;
};
goog.inherits(sre.DynamicTrieNode, sre.AbstractTrieNode);


// TODO: More refined tests depending on the type of query constraint.
/**
 * @constructor
 * @extends {sre.ConstraintTrieNode}
 * @param {string} constraint The constraint the node represents.
 * @param {sre.SpeechRuleStore} store The rule store.
 */
sre.QueryTrieNode = function(constraint, store) {
  sre.QueryTrieNode.base(
    this, 'constructor', constraint,
    goog.bind(
      function(node) { return store.applyQuery(node, constraint) === node; },
      store));
  this.kind = sre.TrieNode.Kind.QUERY;
};
goog.inherits(sre.QueryTrieNode, sre.ConstraintTrieNode);


/**
 * @constructor
 * @extends {sre.ConstraintTrieNode}
 * @param {string} constraint The constraint the node represents.
 * @param {sre.SpeechRuleStore} store The rule store.
 */
sre.BooleanTrieNode = function(constraint, store) {
  sre.BooleanTrieNode.base(
    this, 'constructor', constraint,
    goog.bind(
      function(node) { return store.applyConstraint(node, constraint); },
      store));
  this.kind = sre.TrieNode.Kind.BOOLEAN;
};
goog.inherits(sre.BooleanTrieNode, sre.ConstraintTrieNode);
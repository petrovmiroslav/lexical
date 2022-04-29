/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {EditorConfig, LexicalNode, NodeKey, RangeSelection} from 'lexical';

import {addClassNamesToElement} from '@lexical/utils';
import {$isElementNode, ElementNode} from 'lexical';

export class MarkNode extends ElementNode {
  __ids: Array<string>;

  static getType(): string {
    return 'mark';
  }

  static clone(node: MarkNode): MarkNode {
    return new MarkNode(node.__ids, node.__key);
  }

  constructor(ids: Array<string>, key?: NodeKey): void {
    super(key);
    this.__ids = ids || [];
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('mark');
    addClassNamesToElement(element, config.theme.mark);
    return element;
  }

  updateDOM(): boolean {
    return false;
  }

  hasID(id: string): boolean {
    const ids = this.getIDs();
    for (let i = 0; i < ids.length; i++) {
      if (id === ids[i]) {
        return true;
      }
    }
    return false;
  }

  getIDs(): Array<string> {
    const self = this.getLatest();
    return self.__ids;
  }

  addID(id: string): void {
    const self = this.getWritable();
    const ids = Array.from(self.__ids);
    self.__ids = ids;
    for (let i = 0; i < ids.length; i++) {
      // If we already have it, don't add again
      if (id === ids[i]) {
        return;
      }
    }
    ids.push(id);
  }

  deleteID(id: string): void {
    const self = this.getWritable();
    const ids = Array.from(self.__ids);
    self.__ids = ids;
    for (let i = 0; i < ids.length; i++) {
      if (id === ids[i]) {
        ids.splice(i, 1);
        return;
      }
    }
  }

  insertNewAfter(selection: RangeSelection): null | ElementNode {
    const element = this.getParentOrThrow().insertNewAfter(selection);
    if ($isElementNode(element)) {
      const linkNode = $createMarkNode(this.__ids);
      element.append(linkNode);
      return linkNode;
    }
    return null;
  }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): false {
    return false;
  }

  canBeEmpty(): false {
    return false;
  }

  isInline(): true {
    return true;
  }

  // TODO: It seems excludeFromCopy doesn't work as expected anymore.
  // excludeFromCopy(): true {
  //   return true;
  // }
}

export function $createMarkNode(ids: Array<string>): MarkNode {
  return new MarkNode(ids);
}

export function $isMarkNode(node: ?LexicalNode): boolean %checks {
  return node instanceof MarkNode;
}

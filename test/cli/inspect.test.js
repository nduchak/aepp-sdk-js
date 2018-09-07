/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */

import {describe, it} from 'mocha'

import {configure, BaseAe, execute, parseBlock} from './index'
import {generateKeyPair} from '../../es/utils/crypto'

// rich bich
const keyPair = {
  priv: 'ab14e881e2ac90685146a7c3bf0fc140ca0268d41b051a27cc0a7b9d8573e7592dc51099d9b3921f5578d5968c2b0b5a37d11a6cc514f13862f3a9af7f0ab05f',
  pub: 'ak$MA8Qe8ac7e9EARYK7fQxEqFufRGrG1i6qFvHA21eXXMDcnmuc'
}

describe.skip('CLI Inspect Module', function () {
  configure(this)


  it('Inspect Transaction', async () => {
    const recipient = (generateKeyPair()).pub
    const amount = 1

    const wallet = await BaseAe()
    wallet.setKeypair(keyPair)

    // Create transaction to inspect
    const {hash} = await wallet.spend(amount, recipient)

    const res = parseBlock(await execute(['inspect', 'transaction', hash]))
    res.recipient_account.should.equal(recipient)
    res.sender_account.should.equal(keyPair.pub)
    parseInt(res.amount).should.equal(amount)

  })
  it('Inspect Block', async () => {

    const top = parseBlock(await execute(['chain', 'top']))
    const inspectRes = parseBlock(await execute(['inspect', 'block', top.block_hash]))

    top.block_hash.should.equal(inspectRes.block_hash)

  })
  it('Inspect Height', async () => {

    const top = parseBlock(await execute(['chain', 'top']))
    const inspectRes = parseBlock(await execute(['inspect', 'height', top.block_height]))

    top.block_height.should.equal(inspectRes.block_height)

  })
  it('Inspect Name', async () => {

    const invalidName = await execute(['inspect', 'name', 'asd'])
    const validName = await execute(['inspect', 'name', 'nazdou2222222.aet'])
    invalidName.indexOf('AENS TLDs must end in .aet').should.not.equal(-1)
    validName.indexOf('Status___________ AVAILABLE \n').should.not.equal(-1)
  })
})
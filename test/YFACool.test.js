const { expectRevert } = require('@openzeppelin/test-helpers');
const YFACool = artifacts.require('YFACool');

contract('YFACool', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.yfacToken = await YFACool.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.yfacToken.name();
        const symbol = await this.yfacToken.symbol();
        const decimals = await this.yfacToken.decimals();
        assert.equal(name.valueOf(), 'YFACool');
        assert.equal(symbol.valueOf(), 'YFAC');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.yfacToken.mint(alice, '100', { from: alice });
        await this.yfacToken.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.yfacToken.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.yfacToken.totalSupply();
        const aliceBal = await this.yfacToken.balanceOf(alice);
        const bobBal = await this.yfacToken.balanceOf(bob);
        const carolBal = await this.yfacToken.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.yfacToken.mint(alice, '100', { from: alice });
        await this.yfacToken.mint(bob, '1000', { from: alice });
        await this.yfacToken.transfer(carol, '10', { from: alice });
        await this.yfacToken.transfer(carol, '100', { from: bob });
        const totalSupply = await this.yfacToken.totalSupply();
        const aliceBal = await this.yfacToken.balanceOf(alice);
        const bobBal = await this.yfacToken.balanceOf(bob);
        const carolBal = await this.yfacToken.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.yfacToken.mint(alice, '100', { from: alice });
        await expectRevert(
            this.yfacToken.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.yfacToken.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });

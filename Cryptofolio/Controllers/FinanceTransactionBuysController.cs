using Cryptofolio.Data;
using Cryptofolio.Models;
using Cryptofolio.Services;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinanceTransactionBuysController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public FinanceTransactionBuysController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/FinanceTransactionBuys
        [EnableQuery]
        [HttpGet("/odata/FinanceTransactionBuys")]
        public ActionResult<List<FinanceTransactionBuyDTO>> GetFinanceTransactionBuys()
        {
            if (_context.FinanceTransactionBuys == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }
            else if (_context.FinanceTransactionBuys != null && _userAuthService.getCurrentUserId() != null)
            {
                List<FinanceTransactionBuyDTO> financeTransactionBuys = _context.FinanceTransactionBuys.Where(cs => cs.ApplicationUserId == _userAuthService.getCurrentUserId()).Include(c => c.ApplicationUser).Select(financeTransactionBuys => new FinanceTransactionBuyDTO(financeTransactionBuys)).ToList();
                return Ok(financeTransactionBuys);
            }
            else return BadRequest();
        }

        // GET: api/FinanceTransactionBuys/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FinanceTransactionBuy>> GetFinanceTransactionBuy(int id)
        {
            if (_context.FinanceTransactionBuys == null)
            {
                return NotFound();
            }
            var financeTransactionBuy = await _context.FinanceTransactionBuys.FindAsync(id);

            if (financeTransactionBuy == null)
            {
                return NotFound();
            }

            return financeTransactionBuy;
        }

        // PUT: api/FinanceTransactionBuys/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFinanceTransactionBuy(int id, [FromODataBody] FinanceTransactionBuyDTO financeTransactionBuyDTO)
        {
            FinanceTransactionBuy? financeTransactionBuy = await _context.FinanceTransactionBuys.FirstOrDefaultAsync(x => x.Id == id);

            if (financeTransactionBuy == null)
            {
                if (id != financeTransactionBuy.Id)
                {
                    return BadRequest();
                }
                financeTransactionBuy.Id = financeTransactionBuyDTO.Id;

                financeTransactionBuy.ApplicationUserId = financeTransactionBuyDTO.ApplicationUserId;

                _context.Entry(financeTransactionBuy).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!FinanceTransactionBuyExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

            }
            return NoContent();
        }

        [HttpPatch("{key}")]
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<FinanceTransactionBuyDTO> financeTransactionBuyDTO)
        {
            if (_context.FinanceTransactionBuys == null)
            {
                return Problem("Entity set 'ApplicationDbContext.FinanceTransactionBuyaZs'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.FinanceTransactionBuys.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<FinanceTransactionBuy> deltaFinanceTransactionBuy = FinanceTransactionBuyDTO.toDeltaFinanceTransactionBuy(financeTransactionBuyDTO);

            deltaFinanceTransactionBuy.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FinanceTransactionBuyExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Updated(entity);

        }

        // POST: api/FinanceTransactionBuys
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPost("/odata/FinanceTransactionBuys")]
        public async Task<ActionResult<FinanceTransactionBuy>> PostFinanceTransactionBuy(FinanceTransactionBuyDTO financeTransactionBuyDTO)
        {
            if (_context.FinanceTransactionBuys == null)
            {
                return Problem("Entity set 'ApplicationDbContext.FinanceTransactionBuys'  is null.");
            }


            else if (_userAuthService.getCurrentUserId() != null)
            {


                Coin coins = _context.Coins?.Find(financeTransactionBuyDTO.CoinSymbol.ToString());

                if (coins == null)
                {

                    Coin coin = new Coin();

                    coin.Symbol = financeTransactionBuyDTO.CoinSymbol.ToString();

                    _context.Coins.Add(coin);
                    await _context.SaveChangesAsync();
                }


                FinanceTransactionBuy financeTransactionBuy = financeTransactionBuyDTO.convertToFinanceTransactionBuy();
                //TODO: Add IDs based on claims


                financeTransactionBuy.ApplicationUserId = _userAuthService.getCurrentUserId();
                financeTransactionBuy.Id = 0;
                _context.FinanceTransactionBuys.Add(financeTransactionBuy);
                await _context.SaveChangesAsync();

                financeTransactionBuyDTO.Id = financeTransactionBuy.Id;
                financeTransactionBuyDTO.ApplicationUserId = financeTransactionBuy.ApplicationUserId;

                return CreatedAtAction("GetFinanceTransactionBuy", new { id = financeTransactionBuyDTO.Id }, financeTransactionBuyDTO);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE: api/FinanceTransactionBuys/5
        [EnableQuery]
        [HttpDelete("/odata/FinanceTransactionBuys({id})")]
        public async Task<IActionResult> DeleteFinanceTransactionBuy(int id)
        {
            if (_context.FinanceTransactionBuys == null)
            {
                return NotFound();
            }
            var financeTransactionBuy = await _context.FinanceTransactionBuys.FindAsync(id);
            if (financeTransactionBuy == null)
            {
                return NotFound();
            }

            _context.FinanceTransactionBuys.Remove(financeTransactionBuy);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FinanceTransactionBuyExists(int id)
        {
            return (_context.FinanceTransactionBuys?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}

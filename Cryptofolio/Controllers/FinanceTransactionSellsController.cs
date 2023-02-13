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
    public class FinanceTransactionSellsController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public FinanceTransactionSellsController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/FinanceTransactionSells
        [EnableQuery]
        [HttpGet("/odata/FinanceTransactionSells")]
        public ActionResult<List<FinanceTransactionSellDTO>> GetFinanceTransactionSells()
        {
            if (_context.FinanceTransactionSells == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }
            else if (_context.FinanceTransactionSells != null && _userAuthService.getCurrentUserId() != null)
            {
                List<FinanceTransactionSellDTO> financeTransactionSells= _context.FinanceTransactionSells.Where(cs => cs.ApplicationUserId == _userAuthService.getCurrentUserId()).Include(c => c.ApplicationUser).Select(financeTransactionSells => new FinanceTransactionSellDTO(financeTransactionSells)).ToList();
                return Ok(financeTransactionSells);
            }
            else return BadRequest();
        }

        // GET: api/FinanceTransactionSells/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FinanceTransactionSell>> GetFinanceTransactionSell(int id)
        {
            if (_context.FinanceTransactionSells == null)
            {
                return NotFound();
            }
            var financeTransactionSell= await _context.FinanceTransactionSells.FindAsync(id);

            if (financeTransactionSell == null)
            {
                return NotFound();
            }

            return financeTransactionSell;
        }

        // PUT: api/FinanceTransactionSells/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFinanceTransactionSell (int id, [FromODataBody] FinanceTransactionSellDTO financeTransactionSellDTO)
        {
            FinanceTransactionSell? financeTransactionSell = await _context.FinanceTransactionSells.FirstOrDefaultAsync(x => x.Id == id);

            if (financeTransactionSell == null)
            {
                if (id != financeTransactionSell.Id)
                {
                    return BadRequest();
                }
                financeTransactionSell.Id = financeTransactionSellDTO.Id;

                financeTransactionSell.ApplicationUserId = financeTransactionSellDTO.ApplicationUserId;

                _context.Entry(financeTransactionSell).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!FinanceTransactionSellExists(id))
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
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<FinanceTransactionSellDTO> financeTransactionSellDTO)
        {
            if (_context.FinanceTransactionSells == null)
            {
                return Problem("Entity set 'ApplicationDbContext.FinanceTransactionSells'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.FinanceTransactionSells.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<FinanceTransactionSell> deltaFinanceTransactionSell = FinanceTransactionSellDTO.toDeltaFinanceTransactionSell(financeTransactionSellDTO);

            deltaFinanceTransactionSell.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FinanceTransactionSellExists(key))
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

        // POST: api/
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPost("/odata/FinanceTransactionSells")]
        public async Task<ActionResult<FinanceTransactionSell>> PostFinanceTransactionSell(FinanceTransactionSellDTO financeTransactionSellDTO)
        {
            if (_context.FinanceTransactionSells == null)
            {
                return Problem("Entity set 'ApplicationDbContext.FinanceTransactionSells'  is null.");
            }


            else if (_userAuthService.getCurrentUserId() != null)
            {


                Coin coins = _context.Coins?.Find(financeTransactionSellDTO.CoinSymbol.ToString());

                if (coins == null)
                {

                    Coin coin = new Coin();

                    coin.Symbol = financeTransactionSellDTO.CoinSymbol.ToString();

                    _context.Coins.Add(coin);
                    await _context.SaveChangesAsync();
                }


                FinanceTransactionSell financeTransactionSell = financeTransactionSellDTO.convertToFinanceTransactionSell();
                //TODO: Add IDs based on claims


                financeTransactionSell.ApplicationUserId = _userAuthService.getCurrentUserId();
                financeTransactionSell.Id = 0;
                _context.FinanceTransactionSells.Add(financeTransactionSell);
                await _context.SaveChangesAsync();

                financeTransactionSellDTO.Id = financeTransactionSell.Id;
                financeTransactionSellDTO.ApplicationUserId = financeTransactionSell.ApplicationUserId;

                return CreatedAtAction("GetComment", new { id = financeTransactionSellDTO.Id }, financeTransactionSellDTO);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE: api/FinanceTransactionSells/5
        [EnableQuery]
        [HttpDelete("/odata/FinanceTransactionSells({id})")]
        public async Task<IActionResult> DeleteFinanceTransactionSell(int id)
        {
            if (_context.FinanceTransactionSells == null)
            {
                return NotFound();
            }
            var financeTransactionSell = await _context.FinanceTransactionSells.FindAsync(id);
            if (financeTransactionSell == null)
            {
                return NotFound();
            }

            _context.FinanceTransactionSells.Remove(financeTransactionSell);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FinanceTransactionSellExists(int id)
        {
            return (_context.FinanceTransactionSells?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
